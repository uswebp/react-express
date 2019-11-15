> ### *aさん

1. masterを最新にする
    ```
    git checkout master  
    git fetch origin master  
    ```

2. developを最新にする  
    ```
    git checkout develop  
    git fetch origin develop  
    git pull origin develop
    ```

3. ブランチ作成  
    ```
    git checkout -b name_date  
    ```

> ## 作業後... 
 
4. リモートに送信  
    ```
    git add .  
    git commit -m 'どういう機能か、修正・変更内容' => 1行程度  
    git push origin name_date  
    ```

5. developに変更内容マージ  
    - GitHub上でプルリクエスト name_date => develop 

> ### **bさん 

6. リクエストを確認して、承認 ➔ 承認後...

    ```
    git checkout develop  
    git fetch origin name_date  
    git merge origin name_date  
    ```

7. developブランチで動作確認  ➔ 動作確認後...

8. masterブランチへマージ  
    ```
    git checkout master  
    git fetch origin develop  
    git merge origin develop 
    git push origin master 
    ```








